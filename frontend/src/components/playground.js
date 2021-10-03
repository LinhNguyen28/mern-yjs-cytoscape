import React, { useState, useEffect, Component } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from "cytoscape";

export default class Playground extends Component {
   ydoc = new Y.Doc();
   provider = new WebsocketProvider(
      "wss://demos.yjs.dev",
      "map",
      this.ydoc
   );

   state = {
      w: 0,
      h: 0,
      elements: [
         { data: { id: 'one', label: 'Node 1' }, position: { x: 200, y: 50 } },
         { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 50 } },
         { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
      ],
      nodeId: 3,
   }



   setUpListeners = () => {
      this.cy.on('click', (event) => {
         if (event.target === this.cy) {
            this.cy.add({
               data: {
                  id: `${this.state.nodeId}`,
                  label: `Node ${this.state.nodeId}`
               },
               position: { x: event.position.x, y: event.position.y }
            });

            this.setState({
               nodeId: this.state.nodeId + 1,
               elements: this.cy.json(true)['elements']
            })
         }
      })
   }

   componentDidMount = () => {
      this.setState({
         w: window.innerWidth - 50,
         h: window.innerHeight
      });
      this.setUpListeners();
      let initialE = [
         { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 50 } },
         { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 50 } },
         { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
      ];
      
      // this.provider.connect();
      // this.ydoc.getArray("map").insert(0, initialE);
      // console.log(this.ydoc.getArray("map"));
   }

   connect = () => {
      if (this.provider.shouldConnect) {
         this.provider.disconnect();
         this.textContent = "Connect";
      } else {
         this.provider.connect();
         this.textContent = "Disconnect";
      }
   }

   render() {
      return (<div>
         <button type="button" id="y-connect-btn" onClick={this.connect}>Connect</button>
         <CytoscapeComponent
            elements={this.state.elements}
            style={{ width: this.state.w, height: this.state.h, margin: '0px', padding: '0px' }}
            cy={(cy) => this.cy = cy}
         />
      </div>);
   }
}
