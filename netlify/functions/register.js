// 这个机器人负责接收前台数据，并修改 GitHub 文件
export default async (req, context) => {
    // 1. 只允许 POST 请求
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        // 2. 获取前台发来的顾客数据
        const data = await req.json();
        const { name, phone, country, password } = data;

        // 3. 读取环境变量
        const token = Netlify.env.get("MY_GITHUB_TOKEN");
        const owner = Netlify.env.get("MY_GITHUB_OWNER");
        const repo = Netlify.env.get("MY_GITHUB_REPO");
        const path = "customers.js"; // 目标文件

        // 4. 去 GitHub 获取旧的 customers.js
        const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
        const getRes = await fetch(getUrl, {
            headers: { "Authorization": `token ${token}` }
        });
        const getJson = await getRes.json();
        
        // 5. 解码旧内容 (GitHub 返回的是 Base64)
        // 注意：这里需要处理中文编码
        const oldContent = new TextDecoder().decode(Uint8Array.from(atob(getJson.content), c => c.charCodeAt(0)));

        // 6. 骚操作：因为 customers.js 是 JS 代码不是 JSON，我们需要手动提取数组部分
        // 去掉开头的 "const allCustomers = " 和结尾的 ";"
        const jsonStr = oldContent.replace("const allCustomers = ", "").replace(/;[\s\n]*$/, "");
        let customers = JSON.parse(jsonStr);

        // 7. 添加新顾客
        const newCustomer = {
            id: "cust-" + Date.now(),
            name: name,
            country_code: country,
            phone: phone,
            password: password,
            notes: "系统自动注册",
            history: []
        };
        customers.push(newCustomer);

        // 8. 重新打包成 JS 格式
        const newJsonStr = JSON.stringify(customers, null, 4);
        const newFileContent = `const allCustomers = ${newJsonStr};`;

        // 9. 编码回 Base64 并处理中文
        const encodedContent = btoa(new TextEncoder().encode(newFileContent).reduce((data, byte) => data + String.fromCharCode(byte), ''));

        // 10. 推送回 GitHub
        const putRes = await fetch(getUrl, {
            method: "PUT",
            headers: {
                "Authorization": `token ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: `New User Registration: ${name}`,
                content: encodedContent,
                sha: getJson.sha // 必须带上旧文件的 SHA
            })
        });

        if (putRes.ok) {
            return new Response(JSON.stringify({ message: "Success" }), { status: 200 });
        } else {
            return new Response("GitHub Save Failed", { status: 500 });
        }

    } catch (error) {
        return new Response("Error: " + error.message, { status: 500 });
    }
};
