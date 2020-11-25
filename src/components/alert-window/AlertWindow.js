import "./AlertWindow.css"

export default function AlertWindow(props) {
    
    let buttons = props.buttons
    let content = props.content

    return (
        <div className="alert-container">
            <div className="alert-window">
                <div className="header">
                    <div>
                        Alert!
                    </div>
                    <div className="close-icon" onClick={() => {props.closeModal() }}>x</div>

                </div>
                <div className="content">
                    {content}
                </div>
                <div className="footer">
                    {
                        buttons.map((btn, i) => (
                            <button className="fun-button" key={i} style={{ background: btn.bgcolor, color: btn.color }}
                                onClick={() => {
                                    if(btn.name === "Delete") {
                                        props.deleteTab()
                                    }
                                    else {
                                        props.closeModal()
                                    }
                                }} >
                                {btn.name}
                            </button>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}