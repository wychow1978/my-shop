// 这是你的“总数据库”，包含所有（上架和下架）的产品
// 以后请把 admin.html 生成的代码粘贴覆盖这里
const allProducts = [
    {
        "id": "cup-001",
        "name": "极简陶瓷马克杯",
        "price": 25,
        "image": "product_images/cup.jpg",
        "active": true
    },
    {
        "id": "bag-002",
        "name": "城市漫游帆布包",
        "price": 45,
        "image": "product_images/bag.jpg",
        "active": true
    },
    {
        "id": "lamp-003",
        "name": "黄铜复古台灯",
        "price": 89,
        "image": "product_images/lamp.jpg",
        "active": true
    },
    {
        "id": "cup-002",
        "name": "小叮当杯",
        "price": 19.9,
        "image": "product_images/",
        "active": true
    }
];

// 这一行代码只“过滤”出 active: true 的产品给 index.html 使用
const products = allProducts.filter(p => p.active === true);