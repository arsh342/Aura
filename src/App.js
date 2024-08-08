import { useState } from "react";

const App = () => {
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);

    const surpriseOptions = [
        'Who won the latest Nobel Peace Prize?',
        'Where does pizza come from?',
        'What are the top tourist attractions in Paris?',
        'How do you bake a chocolate cake?',
        'What is the capital of Japan?',
        'Tell me a fun fact about space.',
        'Who invented the telephone?',
        'What is the most popular programming language in 2024?',
        'How do you meditate effectively?',
        'What are the health benefits of yoga?',
        'Tell me a joke.',
        'What is the history of the Internet?',
        'What are the main ingredients in sushi?',
        'How does photosynthesis work?',
        'What are some tips for improving public speaking skills?',
        'What is the tallest mountain in the world?',
        'How do electric cars work?',
        'What is the significance of the Mona Lisa?',
        'Who was the first person to walk on the moon?',
        'What are the benefits of learning a second language?',
        'How can you reduce your carbon footprint?',
        'What is blockchain technology?',
        'Tell me a famous quote by Albert Einstein.',
        'What are the symptoms of the flu?',
        'What is the origin of the Olympic Games?',
        'How do you start a vegetable garden?',
        'What is the difference between AI and machine learning?'
    ];

    const surprise = () => {
        const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
        setValue(randomValue);
    };

    const getResponse = async () => {
        if (!value) {
            setError("Please ask something!");
            return;
        }
        setLoading(true);
        setError("");

        try {
            const options = {
                method: 'POST',
                body: JSON.stringify({
                    history: chatHistory,
                    message: value
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const response = await fetch('http://localhost:8000/gemini', options);
            const data = await response.text();

            setChatHistory(oldChatHistory => [
                ...oldChatHistory,
                {
                    role: "user",
                    parts: [{ text: value }]
                },
                {
                    role: "model",
                    parts: [{ text: data }]
                }
            ]);
            setValue("");
        } catch (error) {
            console.error(error);
            setError("Something went wrong! Please try again later.");
        }
        finally {
            setLoading(false);
        }
    };

    const clear = () => {
        setValue("");
        setError("");
        setChatHistory([]);
    };

    return (
        <div className="app">
            <header className="header">
                <img src="./logo.png" alt="Logo" className="header-logo"/>
                <h1 className="header-text">Aura</h1>
            </header>
            {error && <p className="text-danger text-center my-2">{error}</p>}
            <div className="search-result">
                {chatHistory.map((chatItem, index) => (
                    <div key={index} className="">
                        <p className="font-weight-bold mb-1">{chatItem.role} :</p>
                        <ul className="list-unstyled">
                            {chatItem.parts.map((part, i) => (
                                <li key={i}>{part.text}</li>
                            ))}
                        </ul>
                    </div>
                ))}
                {loading && (
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border text-light" role="status">
                            <span className="sr-only">Generating Response...</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="input-container">
                <input
                    value={value}
                    placeholder="Ask me anything..."
                    onChange={(e) => setValue(e.target.value)}
                    className="form-control mr-2"
                    disabled={loading}
                />
                {!error && !loading &&
                    <button className="btn btn-success" onClick={getResponse}>Ask me</button>}
                {error && !loading && <button className="btn btn-danger" onClick={clear}>Clear</button>}
                <button className="btn btn-info" onClick={surprise}>Surprise Me</button>
            </div>
        </div>
    );
};

export default App;
