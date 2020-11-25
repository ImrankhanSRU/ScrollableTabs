import "./TabContent.css"

export default function TabContent(props) {
    return(
        <div className = "content-container">
            {props.text}
        </div>
    )
}