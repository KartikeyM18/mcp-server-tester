
const RetryButton = ({setShowCheck, setShowLoader, setResult}: {
    setShowCheck: React.Dispatch<React.SetStateAction<boolean>>,
    setShowLoader: React.Dispatch<React.SetStateAction<boolean>>,
    setResult: React.Dispatch<React.SetStateAction<{
        message?: string;
        outputData?: Array<string>;
    } | undefined>>
}) => {
  return (
    <button onClick={()=>{
        setShowCheck(false);
        setShowLoader(false);
        setResult({});
    }} className="w-60 text-3xl py-2 bg-blue-700 border-blue-400 border-2 my-5">
        Retry
    </button>
  )
}

export default RetryButton
