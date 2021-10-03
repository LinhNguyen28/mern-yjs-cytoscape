import React, { useState, useEffect } from "react";
import * as Y from "yjs";
import { WebSocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import CytoscapeComponent from 'react-cytoscapejs';


const Playground = props => {
    const elements = [
        { data: { id: 'one', label: 'Node 1' }, position: { x: 50, y: 50 } },
        { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 50 } },
        { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
     ];
 

     const onClick = (e) => {
        console.log("received double click on cytoscape");
     }

     return <CytoscapeComponent 
     elements={elements} 
     style={{ width: '1000px', height: '600px', margin: '0px', padding: '0px' }}/>;
}

export default Playground;