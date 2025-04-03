import axios from "axios";
import { useState } from "react";
import RetryButton from "../components/RetryButton";
import Loader from "../components/Loader";

const HomePage = () => {
    const [apiKey, setApiKey] = useState('');
    const [installationCode, setInstallationCode] = useState('');

    const [result, setResult] = useState<{ message?: string, outputData?: Array<string> }>();
    const [showCheck, setShowCheck] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    async function callBackend() {
        
        if(installationCode === ''){
            alert('No installation code given');
            return;
        } 
        try{
        setShowLoader(true);
        const installationBody = JSON.parse(installationCode);

            const response = await axios.post(
                "http://localhost:3000/check-mcp",
                installationBody,
                {
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            setResult(response.data);
            setInstallationCode('');
            setShowCheck(true);
            setShowLoader(false);
        } catch(e){
            alert(e);
            setResult({});
            setInstallationCode('');
            setShowCheck(false);
            setShowLoader(false);
        }
    }
    if (showLoader) return <Loader />
    if (showCheck) {
        if (!result) return <div>
            <h1>❌ Failed</h1>
            <RetryButton setShowCheck={setShowCheck} setShowLoader={setShowLoader} setResult={setResult} />
        </div>
        if (!result.outputData) return <div>
            <h1>❌ {result.message}</h1>
            <RetryButton setShowCheck={setShowCheck} setShowLoader={setShowLoader} setResult={setResult} />
        </div>


        return <>
            <div className="flex flex-col gap-3">
                <h1 className="pb-4">{result.message}</h1>
                <div>
                    
                <RetryButton setShowCheck={setShowCheck} setShowLoader={setShowLoader} setResult={setResult} />
                </div>
                {
                    result.outputData &&

                    <div className="flex flex-col border">
                        <h2 className="bg-green-500 text-black text-xl font-semibold">Logs</h2>
                        {result.outputData.map((ele: any) => <p className="text-left border px-2 py-0.5">{ele}</p>)}
                    </div>
                }
            </div>
        </>
    }
    return (
        <>
            <div className='flex flex-col gap-4 items-center'>

                <h1>MCP Server Tester</h1>
                <input type="text" placeholder='Enter Your Smithery API Key' className='w-full px-3 py-1 border' onChange={(e) => setApiKey(e.target.value)} />

                <textarea placeholder='Enter Installation Code in JSON for windows' className='w-full h-80 px-3 py-1 border' onChange={(e) => setInstallationCode(e.target.value)} />

                <button onClick={callBackend} className="w-60 text-3xl py-2 bg-blue-700 border-blue-400 border-2 my-5">Check MCP Server</button>
            </div>

        </>
    )
}

export default HomePage
