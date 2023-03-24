import React, { useState } from "react";
import "./form.css";
import {
  Form,
  Input,
  Button,
  Select,
  Pagination,
  Modal,
  Table,
} from "antd";
import {EditOutlined, DeleteOutlined} from "@ant-design/icons"
const { TextArea } = Input;


// getting data from local storage=========================================================================================================
const getDatafromlocalStorage = () => {
  const data = localStorage.getItem("task");

  if (data) {
    return JSON.parse(data);
  } else {
    return [];
  }
};
// ============================================================================================================================================


const FormToAdd = () => {

  // main array state variable ==============================================================================================
  const [dataSource, setDataSource] = useState(
    getDatafromlocalStorage()
  );

  // use state declared for search bar===============================================================
  const [searchedText, setSearchText] = useState("")


  const columns = [
    {
      title: "Time Created",
      dataIndex: "time",
      key: "time",
      sorter:(record1, record2)=>{
        return record1.time > record2.time
      }
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter:(record1, record2)=>{
        return record1.title > record2.title
      },
      // SEARCH BAR FILTER=========================================
      filteredValue:[searchedText],
      onFilter: (value, record) => {
        return String(record.title)
        .toLowerCase()
        .includes(value.toLowerCase())||
        String(record.Description)
        .toLowerCase()
        .includes(value.toLowerCase())||
        String(record.due_date)
        .toLowerCase()
        .includes(value.toLowerCase())||
        String(record.Status)
        .toLowerCase()
        .includes(value.toLowerCase());
      }
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
      sorter:(record1, record2)=>{
        return record1.Description > record2.Description
      }
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      key: "due_date",
      // SORTER OF STATUS FIELD FILTER=====================================
      sorter:(record1, record2)=>{
        return record1.due_date > record2.due_date
      }
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      filters: [
        {
          text: 'working',
          value: 'working',
        },
        {
          text: 'open',
          value: 'open',
        },
        {
          text: 'done',
          value: 'done',
        },
        {
          text: 'overDue',
          value: 'overDue',
        }
      ],
      onFilter: (value, record) => record.Status.indexOf(value) === 0,
    },

    {
      title:"Actions",
      render:(record)=>{
        return<>
           <EditOutlined onClick={()=>{
            onEditTask(record);
           }} />
           <DeleteOutlined onClick={()=>
           onDeleteTask(record)} style={{color:"red", marginLeft:12}}  />
        </>
      }
    }
  ];

  // delete task=============================================================================================================
  const onDeleteTask=(record)=>{
    Modal.confirm({
      title:"Are you sure , you want to delete this task?",
      okText:'Yes',
      okType:"danger",
      onOk:()=>{
        setDataSource(pre=>{
         const newData = pre.filter((title)=>title.key !== record.key);
         localStorage.setItem("task", JSON.stringify(newData));
         return newData;
         })
      }
    })
  }
  // ==================================================================================================================


// update or modify task================================================================================================
const onEditTask=(record)=>{
  setIsEditing(true);
  setIsEditingTitle({...record})
}
// =================================================================================================================


// states for input fields ===========================================================================================
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);
  const [errordate, setErrorDate] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(null)
  let timestamp = 0;

   // function to check that the TextArea input has no more than 1000 characters=============================================
   const handleTextAreaChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 1000) {
      setText(inputValue);
    }
    else
    {
      alert("word limit upto 1000 words")
    }
  };

  // function to check that the itle input has no more than 100 characters=======================================================
  const handleTitle = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 100) {
      setTitle(inputValue);
    }
    else
    {
      alert("word limit upto 100 words")
    }
  };
// ===============================================================================================================================


  // creating time stamp and rendering table===========================================================================================
  const timestamping = () => {

    // form validation================================================================
    if(!title || !text || !status )
    {
      setError(true)
      return false;
    }
  

    const currentDate = new Date();

    // Get the current time in milliseconds
    const currentTime = currentDate.getTime();

    // Convert the current time to a human-readable format
    timestamp = new Date(currentTime).toLocaleString();

    let task = {
      key: Math.random().toString(36).substr(2, 9),
      time: timestamp,
      title,
      Description: text,
      due_date: date,
      Status: status,
    };
    setDataSource((prevDataSource) => {
      const newDataSource = [...prevDataSource, task];
      localStorage.setItem("task", JSON.stringify(newDataSource));
      return newDataSource;
    });
    setTitle("");
    setDate("");
    setStatus("");
    setText("");
    // setTag("");
    setError(false)
  };
 

  // form submit event=========================================================================================================
  const upDateArray = (e) => {
    e.preventDefault();
  };

 
  const resetEditing=()=>{
    setIsEditing(false);
    setIsEditingTitle(null)
  }

  // due date check=================================================================================================================
  const dateCheck=(e)=>{

    const date = new Date(document.getElementById("input-date").value)
    const inputDate = e.target.value;
    const currentDate = new Date();
    
    if(date < currentDate)
    {
      console.log(date)
      console.log(currentDate)
      setErrorDate(true)
      return false;

    }
    else{
      setDate(inputDate)
      setErrorDate(false)
    }
  }
// ========================================================================================================

  return (
    <div >
      <Form onSubmit={upDateArray} className="frm">
        <Form.Item label="Title of task" required  >
          <Input
            onChange={handleTitle}
            value={title}
            placeholder="Title of task"
          ></Input>
        </Form.Item>
        {error && !title && <span className='invalid-input'>Enter valid title</span>}
       


        <Form.Item label="Description" required>
          <TextArea
            rows={4}
            onChange={handleTextAreaChange}
            value={text}
           
          />
        </Form.Item>
        {error && !text && <span className='invalid-input'>Enter valid text</span>}
        


        <Form.Item label="Due Date">
          <input
          id="input-date"
            type="date"
            onChange={dateCheck}
            value={date}
            className="date"
          />
        </Form.Item>
        {errordate && <span className='invalid-input-d'>Enter valid date, task can't be set in past</span>}


        <Form.Item label="Status" required>
          <Select onChange={(value) => setStatus(`${value}`)} value={status} >
            <Select.Option value="open">Open</Select.Option>
            <Select.Option value="working">working</Select.Option>
            <Select.Option value="done">done</Select.Option>
            <Select.Option value="overDue">overDue</Select.Option>
          </Select>
        </Form.Item>
        {error && !status && <span className='invalid-input'>please select status</span>}



        <Form.Item>
          <Button
            onClick={timestamping}
            className="btn"
            type="submit"
          >
            Add Task
          </Button>
        </Form.Item>
      </Form>


      
     <Input.Search placeholder="search here....." 
      onSearch={(value)=>{
        setSearchText(value)
      }}
      onChange={(e)=>setSearchText(e.target.value)}
      className="search"
     />


      <Table className="tab" dataSource={dataSource} columns={columns} pagination={false} />
     
      <Modal 
      title="Edit task"
      open={isEditing}
      okText="Save"
      onCancel={()=>{
        resetEditing()
      }}
      onOk={()=>{
        setDataSource(pre=>{
          const newTask = pre.map(task=>{
            if(task.key === isEditingTitle.key)
            {
              return isEditingTitle
            }
            else{
              return task;
            }
          })
          localStorage.setItem("task", JSON.stringify(newTask));
          return newTask
        })
        resetEditing()
      }}
      >
       <Input value={isEditingTitle?.title} 
       onChange={(e) => {
        setIsEditingTitle((pre)=>{
          return {...pre, title:e.target.value}
        })
       }}
        />
       <Input value={isEditingTitle?.Description}  
        onChange={(e) => {
        setIsEditingTitle((pre)=>{
          return {...pre, Description:e.target.value}
        })
       }}
       />
       <Input value={isEditingTitle?.due_date}  
        onChange={(e) => {
        setIsEditingTitle((pre)=>{
          return {...pre, due_date:e.target.value}
        })
       }}/>

        <Input value={isEditingTitle?.Status}  
        onChange={(e) => {
        setIsEditingTitle((pre)=>{
          return {...pre, Status:e.target.value}
        })
       }}
       />
      </Modal>

  <Pagination style={{marginTop:20}} defaultCurrent={1} total={100} />

    </div>
  );
};

export default FormToAdd;
