// 终极版机器人：修复了报错 + 防止刷爆 Netlify 额度
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
        const token = process.env.MY_GITHUB_TOKEN;
        const owner = process.env.MY_GITHUB_OWNER;
        const repo = process.env.MY_GITHUB_REPO;
        const path = "customers.js"; 

        if (!token || !owner || !repo) {
            return new Response("Error: Missing Vars", { status: 500 });
        }

        // 4. 去 GitHub 获取旧文件
        const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
        const getRes = await fetch(getUrl, {
            headers: { "Authorization": `token ${token}` }
        });

        if (!getRes.ok) return new Response("GitHub Error", { status: 500 });

        const getJson = await getRes.json();
        const oldContent = new TextDecoder().decode(Uint8Array.from(atob(getJson.content), c => c.charCodeAt(0)));

        // 5. 解析并添加新数据
        const jsonStr = oldContent.replace("const allCustomers = ", "").replace(/;[\s\n]*$/, "");
        let customers = JSON.parse(jsonStr);

        customers.push({
            id: "cust-" + Date.now(),
            name: name,
            country_code: country,
            phone: phone,
            password: password,
            notes: "系统自动注册",
            history: []
        });

        // 6. 重新打包
        const newJsonStr = JSON.stringify(customers, null, 4);
        const newFileContent = `const allCustomers = ${newJsonStr};`;
        const encodedContent = btoa(new TextEncoder().encode(newFileContent).reduce((data, byte) => data + String.fromCharCode(byte), ''));

        // 7. 推送回 GitHub (注意这里加了 [skip ci])
        const putRes = await fetch(getUrl, {
            method: "PUT",
            headers: {
                "Authorization": `token ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // 🌟 重点：[skip ci] 告诉 Netlify "这是机器人改的，别浪费构建时间"
                message: `New User Registration: ${name} [skip ci]`, 
                content: encodedContent,
                sha: getJson.sha
            })
        });

        if (putRes.ok) {
            return new Response(JSON.stringify({ message: "Success" }), { status: 200 });
        } else {
            return new Response("Save Failed", { status: 500 });
        }

    } catch (error) {
        return new Response("Error: " + error.message, { status: 500 });
    }
};
