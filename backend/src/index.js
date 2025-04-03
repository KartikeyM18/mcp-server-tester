const express = require('express');
const cors = require('cors');
const { spawn } = require("child_process");
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;


async function fetchServerData(qualifiedName) {
    try {
        const response = await axios.get(`https://registry.smithery.ai/servers/${qualifiedName}`);
        if (!response.data.connections || !response.data.remote) return { msg: "error" };
        const serverData = response.data.connections;
        // console.log(response.data);

        let func = {};
        for (let i = 0; i < serverData.length; i++) {
            const conn = serverData[i];
            if (conn.type === 'stdio') {
                const onefunc = conn.stdioFunction;
                const stdioFunc = (onefunc.slice(11, onefunc.length - 1)).replace(/(\w+):/g, '"$1":').replace(/'/g, '"');
                func = JSON.parse(stdioFunc);

                break;
            }
        }
        return func;
    } catch (e) {
        console.log("failed to get server data: ", e);
        return { msg: "error" };
    }
}

app.post('/check-mcp', async (req, res) => {
    try {

        const body = req.body;
        const servers = body.mcpServers;
        if (!servers) {
            return res.json({ message: "No MCP servers found in JSON." });
        }

        const serverKeys = Object.keys(servers);
        if (serverKeys.length === 0) {
            return res.json({ message: "No MCP server entries found." });
        }
        const serverConfig = servers[serverKeys[0]];
        const { command, args } = serverConfig;
        if (!command || !args) {
            return res.json({ message: "Invalid MCP server format." });
        }

        let qualifiedName = "";
        for (let i = 0; i < args.length; i++) {
            if (args[i] == 'run') {
                qualifiedName = args[i + 1];
                break;
            }
        }
        const stdioFunc = await fetchServerData(qualifiedName);
        if(stdioFunc.msg === 'error'){
            return res.json({ message: "No Connection to this MCP server." });
        }

        let outputData = [];
        const process = spawn(command, args);

        if(stdioFunc.command && stdioFunc.args){

            // const command2 = 'cmd';
            const command2 = stdioFunc.command
            // const args2 = ['/c', stdioFunc.command, ...(stdioFunc.args)]
            const args2 = stdioFunc.args
            const process2 = spawn(command2, args2);

            process2.stdout.on("data", (data) => {
                outputData.push(data.toString());
            });
            process2.stderr.on("data", (data) => {
                outputData.push(data.toString());
                console.error("Error:", data.toString());
            });
            process2.on("error", () => {
                return res.json({ message: "Server does not exist or command failed." });
            });
            process2.on("close", () => {
                return res.json({ message: "✅ MCP Server Exists!", outputData });
            });
            setTimeout(() => {
                process2.kill();
                console.log("MCP server process terminated due to timeout.");
            }, 22000);
        }


        process.stdout.on("data", (data) => {
            outputData.push(data.toString());
        });
        process.stderr.on("data", (data) => {
            outputData.push(data.toString());
            console.error("Error:", data.toString());
        });
        process.on("error", () => {
            return res.json({ message: "Server does not exist or command failed." });
        });
        setTimeout(() => {

            process.kill(); // Force stop if it's still running
            console.log("MCP server process terminated due to timeout.");
        }, 20000);

        if(!stdioFunc.command || !stdioFunc.args){
            process.on("close", () => {
                return res.json({ message: "✅ MCP Server Exists!", outputData });
            });
        }
        

    } catch (error) {
        return res.json({ message: "Error processing request." });
    }


})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})