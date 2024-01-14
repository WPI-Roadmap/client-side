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

import profRatingsJSON from '../DataParse/ProfessorRating.json';
import classRatingsJSON from '../DataParse/CourseRatings.json';

const elk = new ELK();
const elkOptions = {
    "elk.algorithm": 'layered',
    "elk.padding": "[left=50, top=50, right=50, bottom=50]",
    // separateConnectedComponents: false,
    // "elk.layered.mergeEdges": false,
    "elk.layered.nodePlacement.bk.fixedAlignment": "BALANCED",
    "elk.direction": "UP",
    "spacing.nodeNode": 100,
    "spacing.nodeNodeBetweenLayers": 100,
    'elk.partitioning.activate': 'true',
};

const lerpColor = (h1, h2, progress) => {
  return `hsl(${h1 + Math.round((h2-h1) * progress)}, 100%, 80%)`
}

const getLayoutedElements = (nodes, edges, colorSchema, coursesTaken, profRatings, classRatings, options = {}) => {
  const easyColor = 125;
  const hardColor = -50;
  const codesLeft = new Set();
  if (coursesTaken) coursesTaken.forEach((course) => codesLeft.add(course.courseCode));
  const graph = {
    id: 'root',
    layoutOptions: options,
    children: nodes.map((node) => {
      const courseRating = classRatings[node.courseCode] ? classRatings[node.courseCode] : Math.round(Math.random() * 100);
      const profRating = profRatings[node.professor] ? profRatings[node.professor] : Math.round(Math.random() * 100);
      // shouldn't be nan so often
      if(profRatings[node.professor] == NaN) console.log(node.professor);
      const projRating = 0.6 * profRating + 0.4 * courseRating;

      let gradRe = new RegExp("[A-Z]{2,3} [5-9][0-9]*")
      let style = {};
      switch (colorSchema) {
        case "tot":
          style.backgroundColor = lerpColor(hardColor, easyColor, projRating/100.0);
        break;
        case "prof":
          style.backgroundColor = lerpColor(hardColor, easyColor, profRating/100.0);
        break;
        case "course":
          style.backgroundColor = lerpColor(hardColor, easyColor, courseRating/100.0);
        break;
        case 'level':
          style.backgroundColor = lerpColor(easyColor, hardColor, gradRe.test(node.courseCode));
        break;
        default:
          style = {};
      }
      if (codesLeft.has(node.courseCode)) {
        style.backgroundColor = "rgb(138, 138, 138)";
        style.color = "rgb(225, 225, 225)";
      }
      if (node.type === "group") {
        style.display = "none";
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

function FlowWithoutProvider({initialNodes, initialEdges, colorSchema, coursesTaken}) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const [profRatings, setProfRatings] = useState(profRatingsJSON);
  const [classRatings, setClassRatings] = useState(classRatingsJSON);
 
  let [courseCode, setCourseCode] = useState("");

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
  let onLayout = useCallback(
    ({ direction, useInitialNodes = false }) => {
      const opts = { 'elk.direction': direction, ...elkOptions };
      const ns = useInitialNodes ? initialNodes : nodes;
      const es = useInitialNodes ? initialEdges : edges;

      getLayoutedElements(ns, es, colorSchema, coursesTaken, profRatings, classRatings, opts).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);

        window.requestAnimationFrame(() => fitView());
      });
    },
    [nodes, edges, initialNodes, initialEdges, colorSchema, coursesTaken, profRatings, classRatings]
  );

  useLayoutEffect(() => {
    onLayout({ direction: 'UP', useInitialNodes: true });
  }, [initialNodes, initialEdges, colorSchema, coursesTaken]);

  // Calculate the initial layout on mount.
  useLayoutEffect(() => {
    onLayout({ direction: 'UP', useInitialNodes: true });
  }, []);


  function onNodeClick(event, node) {
    setIsModalOpen(true);
    setCourseCode(node.courseCode);
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