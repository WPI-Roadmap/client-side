import { Modal } from 'antd';
import ELK from 'elkjs/lib/elk.bundled.js';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from 'reactflow';

import 'reactflow/dist/style.css';
import DataParse from '../DataParse/DataParse';

import profRatings from '../DataParse/ProfessorRating.json';
import classRatings from '../DataParse/CourseRatings.json';
import data from "../DataParse/prod-data.json"

const elk = new ELK();
const elkOptions = {
    "elk.algorithm": 'layered',
    "elk.padding": "[left=50, top=50, right=50, bottom=50]",
    // separateConnectedComponents: false,
    // "elk.layered.mergeEdges": false,
    "elk.layered.nodePlacement.bk.fixedAlignment": "BALANCED",
    "elk.direction": "UP",
    "spacing.nodeNode": 50,
    "spacing.nodeNodeBetweenLayers": 50,
    'elk.partitioning.activate': 'true',
};

const lerpColor = (h1, h2, progress) => {
  return `hsl(${h1 + Math.round((h2-h1) * progress)}, 100%, 80%)`
}

const getLayoutedElements = (nodes, edges, colorSchema, options = {}) => {
  // console.log('changed ' + colorSchema)
  const easyColor = 125;
  const hardColor = 0;
  const graph = {
    id: 'root',
    layoutOptions: options,
    children: nodes.map((node) => {
      const courseRating = classRatings[node.courseCode] ? classRatings[node.courseCode] : Math.round(Math.random() * 100);
      const profRating = profRatings[node.professor] ? profRatings[node.professor] : Math.round(Math.random() * 100);
      const projRating = 0.6 * profRating + 0.4 * courseRating;
      // console.log("rating " + projRating);
      let style;
      switch (colorSchema) {
        case "tot":
          style = {
            backgroundColor: lerpColor(easyColor, hardColor, projRating/100),
          }
        break;
        case "prof":
          style = {
            backgroundColor: lerpColor(easyColor, hardColor, profRating/100),
          }
        break;
        case "course":
          style = {
            backgroundColor: lerpColor(easyColor, hardColor, courseRating/100),
          }
        break;
        default:
          style = {};
      }

      return {
      ...node,
      // Adjust the target and source handle positions based on the layout
      // direction.
      targetPosition: 'bottom',
      sourcePosition: 'top',
      layoutOptions: {
        'partitioning.partition': 7 - node.courseType,
      },

      // Hardcode a width and height for elk to use when layouting.
      width: 150,
      height: 50,
      className: "courseNode",
      style: style,
    }}),
    edges: edges,
  };

  return elk
    .layout(graph)
    .then((layoutedGraph) => ({
      nodes: layoutedGraph.children.map((node) => ({
        ...node,
        // React Flow expects a position property on the node instead of `x`
        // and `y` fields.
        position: { x: node.x, y: node.y },
      })),
      edges: layoutedGraph.edges,
    }))
    .catch(console.error);
};

function FlowWithoutProvider({initialNodes, initialEdges, colorSchema}) {

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  let [courseCode, setCourseCode] = useState("");

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
  let onLayout = useCallback(
    ({ direction, useInitialNodes = false }) => {
      const opts = { 'elk.direction': direction, ...elkOptions };
      const ns = useInitialNodes ? initialNodes : nodes;
      const es = useInitialNodes ? initialEdges : edges;

      getLayoutedElements(ns, es, colorSchema, opts).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);

        window.requestAnimationFrame(() => fitView());
      });
    },
    [nodes, edges, colorSchema]
  );

  useLayoutEffect(() => {
    onLayout({ direction: 'UP', useInitialNodes: true });
  }, [colorSchema]);

  // Calculate the initial layout on mount.
  useLayoutEffect(() => {
    onLayout({ direction: 'UP', useInitialNodes: true });
  }, []);


  function onNodeClick(event, node) {
    setIsModalOpen(true);
    setCourseCode(node.data.label.substring(0, 8));

    console.log(node.data.label.substring(0, 8));
    // Do something when a node is clicked
    
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleCancel() {
    setIsModalOpen(false);
  }

  return (
    <>
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      fitView
    >
    </ReactFlow>
    <Modal title="Course Information" open={isModalOpen} onCancel={handleCancel} footer={[]}>
      <div>
        <DataParse course_code={courseCode} />
        </div>
    </Modal>
    </>
  );
}

function Flow(props) {
    return (
        <ReactFlowProvider>
          <FlowWithoutProvider {...props} />
        </ReactFlowProvider>
      );
}

export default Flow;