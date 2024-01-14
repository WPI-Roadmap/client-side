import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table } from 'antd';
import RequestUtils from '../../Utils/RequestUtils';
import { auth } from '../../Firebase';

import { useAuthState } from 'react-firebase-hooks/auth';
const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};
const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);
    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };
    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({
                ...record,
                ...values,
            });
            let fullObj = {...record, ...values};

            RequestUtils.post("/update", fullObj).then((response) => response.json())
            .then((data) => {
                console.log(data);
            });

            console.log({...record, ...values})

        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };
    let childNode = children;
    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }
    return <td {...restProps}>{childNode}</td>;
};


const App = () => {

    let [ user, loading ] = useAuthState(auth);
    const [dataSource, setDataSource] = useState([]);


    useEffect(() => {
        if (user) {
            addData();
        }


    }, [user]);

    function addData() {
        let temp = [];
        RequestUtils.get("/retrieve?id=" + user.uid).then((response) => response.json())
        .then((data) => {
            try{
            for (let i = 0; i < data.data.courses.length; i++) {
                temp.push({
                    key: i,
                    id: user.uid,
                    course: data.data.courses[i].courseCode,
                    grade: data.data.courses[i].grade,
                    term: data.data.courses[i].term,
                })
            }
        } catch (err){
            console.log(err);
        }
            console.log(data.data.courses);
            console.log(temp)
            setDataSource(temp);
        });
    }



    const [count, setCount] = useState(2);
    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };

    const defaultColumns = [
        {
            title: 'UserID',
            dataIndex: "id",
            width: '30%',
        },
        {
            title: 'Course Title',
            dataIndex: 'course',
            width: '10%',
        },
        {
            title: 'Term',
            dataIndex: 'term',
            editable: true,
        },
        {
            title: 'Grade',
            dataIndex: 'grade',
            editable: true,
        },
        {
            title: 'Remove Course',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                        <a>Delete</a>
                    </Popconfirm>
                ) : null,
        },
    ];

    const handleAdd = () => {
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: '32',
            address: `London, Park Lane no. ${count}`,
        };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };

    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(newData);
    };
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });
    return (
        <div>
            <p>Click on the cells below to add the term you plan to take the course as well as the grade you recieve.</p>
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns}
            />
        </div>
    );
};
export default App;