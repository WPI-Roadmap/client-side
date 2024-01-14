import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

export default memo(({ data, isConnectable }) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Bottom}
        style={{ background: '#555'}}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: data.showTitle ? 10 : 20,
        fontSize: "1.5rem", width: "9em", minHeight: "4em"
      }}>
          <b>{data.courseCode}</b>
          { data.showTitle ?  <span style={{textAlign: "center"}}>{data.courseTitle}</span> : <></>}
      </div>
      <Handle
        type="source"
        position={Position.Top}
        style={{ top: 10, background: '#555' }}
        isConnectable={isConnectable}
      />
    </>
  );
});