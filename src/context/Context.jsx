import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    // save input data
    const [input, setInput] = useState("");
    // will display in prompt main
    const [recentPrompt, setRecentPrompt] = useState("");
    // for input history
    const [prevPrompts, setPrevPrompts] = useState([]);
    //  to show the result or not when it tru will hide text...
    const [showResult, setShowResult] = useState(false);
    // display data
    const [loading, setLoading] = useState(false);
    // display on web page
    const [resultData, setResultData] = useState("");

    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev => prev + nextWord);
        }, 75 * index)
    }
    const newChat = ()=>{
        setLoading(false)
        setShowResult(false)
    }
    const onSent = async (prompt) => {

        setResultData("");
        setLoading(true);
        setShowResult(true);
        let response;

        if (typeof prompt !== 'undefined') {
            response = await runChat(prompt);
            setRecentPrompt(prompt);
        } else {
            setPrevPrompts(prev => [...prev, indexinput])
            setRecentPrompt(input)
            response = await runChat(input)
        }
        setRecentPrompt(input);
        setPrevPrompts(prev => [...prev, input]);
        // const response = await runChat(input);
        let responseArray = response.split("**");
        let newResponse = "";
        for (let i = 0; i < responseArray.length; i++) {
            if (i == 0 || i % 2 !== 1) {
                newResponse += responseArray[i];
            }
            else {
                newResponse += "<b>" + responseArray[i] + "</b>";
            }
        }
        let newRes2 = newResponse.split("*").join("</br>")
        let newResArray = newRes2.split(" ");
        for (let i = 0; i < newResArray.length; i++) {
            const nextWord = newResArray[i];
            delayPara(i, nextWord + " ")
        }
        setResultData(newRes2);
        setLoading(false);
        setInput("");
    }

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }
    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}
export default ContextProvider