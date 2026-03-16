/**
 * @file speedsms.service.js
 * @description SpeedSMS service — send single SMS, handle webhooks.
 */

const { AppError, ValidationError } = require('../utils/errors');
const logger = require('../utils/logger');

const SPEEDSMS_API_TOKEN = process.env.SPEEDSMS_API_TOKEN;
const SPEEDSMS_SENDER = process.env.SPEEDSMS_SENDER || "";

async function sendSMS(phone, content) {
  if (!SPEEDSMS_API_TOKEN) {
    throw new AppError('SpeedSMS API Token is missing.', 503, 'PROVIDER_NOT_CONFIGURED');
  }
  
  // Chuẩn hóa số điện thoại: SpeedSMS yêu cầu mã quốc gia 84 ở đầu, không có dấu '+' hoặc số '0'
  let formattedPhone = phone.replace(/^\+/, '');
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '84' + formattedPhone.slice(1);
  }

  const payload = {
    to: [formattedPhone],
    content: content,
    sms_type: 5,
    sender: SPEEDSMS_SENDER
  };

  // Xác thực Basic Auth theo chuẩn SpeedSMS (username là Token, password là "x")
  const authHeader = 'Basic ' + Buffer.from(SPEEDSMS_API_TOKEN + ':x').toString('base64'); //

  try {
    const response = await fetch('https://api.speedsms.vn/index.php/sms/send', { //
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.status === 'error') {
      logger.error('SpeedSMS send failed', { phone, error: data.message });
      throw new AppError(`SpeedSMS Error: ${data.message}`, 502, 'SMS_SEND_FAILED');
    }

    // Lấy tranId từ data trả về để lưu vào providerMessageId
    const tranId = data.data?.tranId || data.data?.campaignId || `speedsms_${Date.now()}`;
    
    logger.info('SMS sent via SpeedSMS', { messageId: tranId, phone });

    return {
      messageId: tranId.toString(),
      status: 'SENT',
      raw: data
    };
  } catch (error) {
    throw new AppError(`Failed to send SMS: ${error.message}`, 502, 'SMS_SEND_FAILED');
  }
}

function handleWebhook(payload) {
  // SpeedSMS trả về webhook theo định dạng: {"type": "report", "tranId": 1234, "phone": "0912...", "status": 0}
  if (!payload || payload.type !== 'report') {
    throw new ValidationError('Invalid SpeedSMS webhook payload');
  }

  let mappedStatus = 'PENDING';
  if (payload.status === 0) { // status = 0 là gửi thành công
    mappedStatus = 'DELIVERED';
  } else if (payload.status >= 64) { // status >= 64 là thất bại hoàn toàn
    mappedStatus = 'FAILED';
  } else if (payload.status > 0 && payload.status < 64) { // Lỗi tạm thời (chưa gửi được ngay)
    mappedStatus = 'BOUNCED'; 
  }

  return {
    providerMessageId: payload.tranId ? payload.tranId.toString() : null,
    status: mappedStatus,
    errorReason: payload.status !== 0 ? `SpeedSMS Error Status: ${payload.status}` : null,
    rawPayload: payload
  };
}

module.exports = { sendSMS, handleWebhook };