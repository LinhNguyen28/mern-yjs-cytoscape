import React, { useState, useEffect, Component } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
// import { IndexeddbPersistence } from "y-indexeddb";
import CytoscapeComponent from 'react-cytoscapejs';

export default class Playground extends Component {
   ydoc = new Y.Doc();
   provider = new WebsocketProvider(
      "wss://demos.yjs.dev",
      "map",
      this.ydoc
   );
   elementsArr = this.ydoc.getArray("map");
   initialE = [
      { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 50 } },
      { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 50 } },
      { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
   ];

   state = {
      w: 0,
      h: 0,
      elements: this.elementsArr.toArray(),
      nodeId: 3,
      textContent: "Disconnect",
   }

   setUpListeners = () => {
      this.cy.on('click', (event) => {
         if (event.target === this.cy) {
            // this.cy.add({
            //    data: {
            //       id: `${this.state.nodeId}`,
            //       label: `Node ${this.state.nodeId}`
            //    },
            //    position: { x: event.position.x, y: event.position.y }
            // });
            
            this.elementsArr.push([{
               data: {
                  id: `${this.state.nodeId}`,
                  label: `Node ${this.state.nodeId}`
               },
               position: { x: event.position.x, y: event.position.y }
            }]);
            console.log(this.elementsArr.toJSON());
            if (this.elementsArr.length > 10) {
               console.log("Need to delete some nodes");
               this.elementsArr.delete(0, this.elementsArr.length);
               this.elementsArr.insert(0, this.initialE);
            }
            this.setState({
               nodeId: this.state.nodeId + 1,
            })
         }
      })
   }

   componentDidMount = () => {
      this.setState({
         w: window.innerWidth - 50,
         h: window.innerHeight - 50,
      });
      this.setUpListeners();
      this.provider.connect();
      this.elementsArr.observe((event, transaction) => {
         console.log("Sync changes");
         this.setState({
            elements: this.elementsArr.toArray(),
         })
      });
   }

   connect = () => {
      if (this.provider.shouldConnect) {
         console.log("Here")
         this.provider.disconnect();
         this.elementsArr.unobserve(() => {
            console.log("No more observation or sync")
         });
         this.setState({textContent:"Connect"});
      } else {
         this.provider.connect();
         this.elementsArr.observe((event, transaction) => {
            console.log("Sync changes");
            this.setState({
               elements: this.elementsArr.toArray(),
            })
         });
         this.setState({textContent:"Disconnect"});
      }
   }

   render() {
      return (<div>
         <button type="button" 
         id="y-connect-btn" 
         onClick={this.connect}>
            {this.state.textContent}
         </button>
         <CytoscapeComponent
            elements={this.state.elements}
            style={{ width: this.state.w, height: this.state.h, margin: '0px', padding: '0px' }}
            cy={(cy) => this.cy = cy}
         />
      </div>);
   }
}
