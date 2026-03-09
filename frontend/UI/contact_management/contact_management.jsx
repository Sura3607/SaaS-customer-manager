import {
  CalendarOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  FilterOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Flex,
  Input,
  Pagination,
  Select,
  Space,
  Table,
  Tag,
} from "antd";

export default function ContactManagementSection() {
  const columns = [
    {
      title: "FULL NAME",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Flex gap={12} align="center">
          <Avatar style={{ backgroundColor: record.avatarBg }}>
            {record.initials}
          </Avatar>
          <span>{text}</span>
        </Flex>
      ),
    },
    {
      title: "CONTACT INFO",
      dataIndex: "contact",
      key: "contact",
      render: (contact) => (
        <div>
          <div>{contact.email}</div>
          <div style={{ fontSize: "12px", opacity: 0.6 }}>{contact.phone}</div>
        </div>
      ),
    },
    {
      title: "ADDRESS",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusConfig = {
          Active: "success",
          Pending: "warning",
          Inactive: "default",
        };
        return <Tag color={statusConfig[status]}>{status}</Tag>;
      },
    },
    {
      title: "ACTIONS",
      key: "actions",
      align: "right",
      render: () => (
        <Space>
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  const dataSource = [
    {
      key: "1",
      name: "Jonathan Smith",
      initials: "JS",
      avatarBg: "#1f73f933",
      contact: {
        email: "jon.smith@example.com",
        phone: "+1 (555) 123-4567",
      },
      address: "San Francisco, CA",
      status: "Active",
    },
    {
      key: "2",
      name: "Marcus Wright",
      initials: "MW",
      avatarBg: "#f9731633",
      contact: {
        email: "m.wright@techflow.io",
        phone: "+1 (555) 987-6543",
      },
      address: "Austin, TX",
      status: "Pending",
    },
    {
      key: "3",
      name: "Katherine Lee",
      initials: "KL",
      avatarBg: "#21314a",
      contact: {
        email: "klee@designhub.co",
        phone: "+1 (555) 444-3322",
      },
      address: "New York, NY",
      status: "Inactive",
    },
  ];

  return (
    <div style={{ padding: "32px 192px" }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <div>
          <h1
            style={{
              fontSize: 30,
              fontWeight: 900,
              margin: 0,
              marginBottom: 8,
            }}
          >
            Contact Management
          </h1>
          <p style={{ margin: 0, opacity: 0.6 }}>
            Manage, filter and track your organization's customer relations.
          </p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large">
          Add Customer
        </Button>
      </Flex>

      <Flex gap={16} style={{ marginBottom: 24 }}>
        <Input
          placeholder="Search by name, email, or company..."
          prefix={<SearchOutlined />}
          size="large"
          style={{ flex: 1 }}
        />
        <Select
          defaultValue="all"
          size="large"
          style={{ width: 141 }}
          suffixIcon={<FilterOutlined />}
          options={[{ value: "all", label: "All Status" }]}
        />
        <Select
          defaultValue="30days"
          size="large"
          style={{ width: 226 }}
          suffixIcon={<CalendarOutlined />}
          options={[{ value: "30days", label: "Created: Last 30 Days" }]}
        />
        <Button size="large" icon={<DownloadOutlined />} />
      </Flex>

      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        style={{ marginBottom: 16 }}
      />

      <Flex justify="space-between" align="center">
        <div>
          Showing <strong>1</strong> to <strong>3</strong> of{" "}
          <strong>124</strong> contacts
        </div>
        <Pagination
          current={1}
          total={124}
          pageSize={3}
          showSizeChanger={false}
          itemRender={(page, type, originalElement) => {
            if (type === "prev") {
              return <Button icon={<LeftOutlined />} />;
            }
            if (type === "next") {
              return <Button icon={<RightOutlined />} />;
            }
            return originalElement;
          }}
        />
      </Flex>
    </div>
  );
}