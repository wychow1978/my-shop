// 这是你的“客户数据库”
// 以后 admin.html 会自动修改这个文件
const allCustomers = [
    {
        id: "cust-001",
        name: "Wai Yuen",
        phone: "60123456789", 
        notes: "这是老板自己",
        history: [
            { date: "2026-01-21", invoice: "INV-1001", items: "极简咖啡杯", amount: 25.00 }
        ]
    },
    {
        id: "cust-002",
        name: "Test User",
        phone: "60111111111",
        notes: "测试用户",
        history: []
    }
];
