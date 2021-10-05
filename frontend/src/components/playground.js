import React, { Component } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import CytoscapeComponent from 'react-cytoscapejs';
import Button from 'react-bootstrap/Button';
import popper from "cytoscape-popper";
import cytoscape from "cytoscape";

cytoscape.use(popper);

export default class Playground extends Component {
   ydoc = new Y.Doc();
   provider = new WebsocketProvider(
      "wss://demos.yjs.dev",
      "map",
      this.ydoc
   );
   elementsArr = this.ydoc.getArray("map");

   state = {
      w: 0,
      h: 0,
      nodeId: 1,
      elements: [],
      textContent: "Disconnect"
   }

   setUpListeners = () => {
      this.cy.on('click', (event) => {
         if (event.target === this.cy) {
            this.cy.add({
               data: {
                  label: `Node ${this.state.nodeId}`
               },
               position: { x: event.position.x, y: event.position.y }
            });
         }
         this.updateRemote();
      });

      this.cy.on("cxttapend", "node", event => {
         let node = this.cy.add({
            data: {
               label: `Node ${this.state.nodeId}`
            },
            position: { x: event.position.x, y: event.position.y }
         });
         this.cy.add({
            data: {
               source: event.target.data()["id"],
               target: node.data()["id"]
            }
         });
         this.updateRemote();
      });
      
      this.cy.on("dragfreeon", this.updateRemote);

      let tips = document.createElement("div"); 

      this.cy.on("mouseover", 'node', event => {
         let target = event.target;
         target.popperref = event.target.popper({
           content: () => {
             tips.innerHTML = event.target.data("label");
             tips.style =
               "background-color: black;color: #fff;text-align: left; padding: 0 5px;border-radius: 6px";
             tips.className = "tooltiptext";
             document.body.appendChild(tips);
             return tips;
           },
           popper: {
             placement: "top-start",
             removeOnDestroy: true
           }
         });
       });
      this.cy.on("mouseout", "node", (_) => {
         document.body.removeChild(tips);
       });

   }

   componentDidMount = () => {
      console.log("componentDidMount");
      this.setState({
         w: window.innerWidth - 50,
         h: window.innerHeight - 50,
      });
      this.setUpListeners();
      this.connect();
      this.elementsArr.observe((event, transaction) => {
         console.log("sync changes");
         this.setState({
            elements: this.elementsArr.toArray(),
            nodeId: this.elementsArr.length + 1,
         })
      });
   }

   updateRemote = () => {
      let elements = this.cy.json(true)["elements"];
      console.log(elements);
      this.elementsArr.delete(0, this.elementsArr.length);
      this.elementsArr.insert(0, elements);
   }

   connect = () => {
      if (this.provider.wsconnected || this.provider.wsconnecting) {
         this.provider.disconnect();
         this.setState({textContent:"Connect"});
      } else {
         this.provider.connect();
         this.setState({textContent:"Disconnect"});
      }
   }

   clear = () => {
      this.elementsArr.delete(0, this.elementsArr.length);
   }

   render() {
      return (<div>
         <Button
            className="btn-primary"
            id="y-connect-btn" 
            onClick={this.connect}>
               {this.state.textContent}
         </Button>
         <Button 
            className="btn-warning ml-3"
            id="clear-btn" 
            onClick={this.clear}>
               Clear
         </Button>
         <p id="userTrack"></p>
         <CytoscapeComponent
            elements={this.state.elements}
            style={{ width: this.state.w, height: this.state.h, margin: '0px', padding: '0px' }}
            cy={(cy) => this.cy = cy}
         />
      </div>);
   }
}
