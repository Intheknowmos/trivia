

export default function Quizapp(props) {
    const styles = {
        backgroundColor: "#edf2fb",
        margin: "10px",
    }
    return (
        <div className="main">
            <h2>{props.question}</h2>
            <div className="option-container">
                {props.option}
            </div>
        </div>
    )
}