// 客户数据库
// 包含：身份信息、密码（暂存）、历史订单
const allCustomers = [
    {
        id: "cust-001",
        name: "Wai Yuen",
        country_code: "+60",
        phone: "123456789", 
        password: "password123", // 以后升级数据库时用
        notes: "老板账号",
        history: [
            { date: "2026-01-20", invoice: "INV-1001", items: "极简咖啡杯", amount: 25.00 },
            { date: "2026-01-21", invoice: "INV-1005", items: "帆布包", amount: 45.00 }
        ]
    },
    {
        id: "cust-002",
        name: "Test User",
        country_code: "+65",
        phone: "98765432",
        password: "123",
        notes: "新加坡客户",
        history: []
    }
];
