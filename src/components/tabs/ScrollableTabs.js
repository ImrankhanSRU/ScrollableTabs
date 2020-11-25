import React, { Component } from "react";
import "./ScrollableTabs.css";
import chevronLeft from "../../assets/chevron-left.png"
import chevronRight from "../../assets/chevron-right.png"
import plusIcon from "../../assets/plus.png"
import AlertWindow from "../alert-window/AlertWindow"
import TabContent from "../tab-content/TabContent"


var placeholder = document.createElement("span");
placeholder.className = "placeholder";


export default class ScrollableTabs extends Component {


    state = {
        tabs: [{ id: 1, title: 'Tab1', content: "Hi! This is Tab 1" }, { id: 2, title: 'Tab2', content: "Hi! This is Tab 2" }, 
        { id: 3, title: 'Tab3', content: "Hi! This is Tab 3" }],
        activeTab: 1,
        chevronCount: 0,
        nextId: 4,
        isHovered: {},
        showModal: false,
        buttons: [{ name: "Cancel", color: "lightgray" }, { name: "Delete", color: "red" }],
        content: "Are you sure?",
        deleteIndex: 0,
        activeIndex: 0
    }

    dragStart = (e) => {
        this.dragged = e.currentTarget;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.dragged);
    }
    dragEnd = (e) => {
        this.dragged.style.display = 'inline-block';
        try {
            this.dragged.parentNode.removeChild(placeholder);
            var data = this.state.tabs;
            var from = Number(this.dragged.dataset.id);
            var to = Number(this.over.dataset.id);
            if (from < to) to--;
            data.splice(to, 0, data.splice(from, 1)[0]);
            this.setState({ tabs: data });
        } catch (e) {
        }

        // update state

    }
    dragOver = (e) => {
        e.preventDefault();
        this.dragged.style.display = "none";
        if (e.target.className === 'placeholder') return;
        this.over = e.target;
        e.target.parentNode.insertBefore(placeholder, e.target);
    }


    myRef = React.createRef()

    scroll = (scrollOffset) => {
        this.myRef.current.scrollLeft += scrollOffset;

        let prevCount = this.state.chevronCount
        // let chevronCount = scrollOffset === 150 ? prevCount++ : prevCount--

        this.setState({ chevronCount: scrollOffset === 150 ? prevCount + 1 : prevCount - 1 })

    };

    activeTab = (activeTab) => {            //To make a tab active
        this.setState({ activeTab })
    }

    addTab = () => {
        let { tabs } = this.state
        tabs.push({ id: this.state.nextId, title: `Tab${this.state.nextId}`, content: `Hi! This is Tab ${this.state.nextId}` })
        let { nextId } = this.state
        nextId++;
        this.setState({ tabs, nextId })
        setTimeout(() => {
            this.scroll(150)
        }, 0)
    }

    deleteTab = () => {
        let tabs = [...this.state.tabs]

        tabs.splice(this.state.deleteIndex, 1)
        if (this.state.tabs[this.state.deleteIndex].id === this.state.activeTab) {
            this.activeTab(tabs[0].id)
        }
        this.setState({ tabs })
        this.closeModal()
    }

    handleMouseEnter = index => {
        this.setState(prevState => {
            return { isHovered: { ...prevState.isHovered, [index]: true } };
        });
    };

    handleMouseLeave = index => {
        this.setState(prevState => {
            return { isHovered: { ...prevState.isHovered, [index]: false } };
        });
    };

    openModal = (fun, index) => {
        let buttons;
        let content;

        if (index !== undefined) {
            this.setState({deleteIndex: index})
        }

        if (fun === "delete") {
            buttons = [{ name: "Cancel", bgcolor: "lightgray", color: "black" }, { name: "Delete", bgcolor: "red", color: "white" }]
            content = "Are you sure?"
        }
        else {
            buttons = [{ name: "Cancel", bgcolor: "lightgray", color: "black" }]
            content = "Maximum tabs allowed 10"
        }
        this.setState({ buttons, showModal: true, content })
        
    }

    closeModal = () => {
        this.setState({ showModal: false })
    }

    getActiveTabText = () => this.state.tabs.filter(item => item.id === this.state.activeTab)[0].content      //Get current tab text
    


    render() {
        var listItems = this.state.tabs.map((item, index) => {                                  //Tabs list
            let classNames = `child ${item.id === this.state.activeTab ? "active-tab" : ""}`
            return (
                <div className={classNames}
                    data-id={index}
                    key={item.id}
                    draggable='true'
                    onDragEnd={this.dragEnd}
                    onDragStart={this.dragStart}
                    onMouseEnter={() => this.handleMouseEnter(index)}
                    onMouseLeave={() => this.handleMouseLeave(index)}>

                    <span className="tab-title" onClick={() => { this.activeTab(item.id) }}>
                        {item.title}
                    </span>
                    {
                        this.state.isHovered[index] && this.state.tabs.length > 1 &&
                        <span className="close-icon" onClick={() => { this.openModal("delete", index) }}>x</span>
                    }
                </div>
            )
        });


        return (
            <div className="container">
                {
                    this.state.showModal &&
                    <AlertWindow className = "alert" buttons={this.state.buttons} content={this.state.content} deleteTab={this.deleteTab}
                        closeModal={this.closeModal} />
                }
                <h2 className="title">Tabs Container</h2>

                <div className="tabs-container" >

                    <span onClick={() => this.scroll(-150)} className={this.state.chevronCount && this.state.tabs.length > 3 ? "show-chevron" : "hide-chevron"}>
                        <img src={chevronLeft} alt="" className="chevron-image" />
                    </span>

                    <div className="parent" onDragOver={this.dragOver} ref={this.myRef}>
                        {listItems}
                    </div>
                    <span onClick={() => this.scroll(150)} className={this.state.tabs.length > 3 &&
                        this.state.tabs.length - (this.state.chevronCount + 2) > 1 ? "show-chevron" : "hide-chevron"}>
                        <img src={chevronRight} className="chevron-image" alt="" />
                    </span>
                    <span>
                        <img src={plusIcon} alt="" className="chevron-image plus-image"
                            onClick={() => {
                                if (this.state.tabs.length === 10) {
                                    this.openModal("Add")
                                }
                                else {
                                    this.addTab()
                                }
                            }} />
                    </span>
                </div>
                <div className = "tab-content">
                    <TabContent text = {this.getActiveTabText()} />
                </div>
            </div>
        )
    }
}


// export default ScrollableTabs;