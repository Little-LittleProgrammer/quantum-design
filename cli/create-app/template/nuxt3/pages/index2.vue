<template>
      <div class="container">
        <a-alert
          message="Success Text"
          type="success"
        />
        <div>
          icon:
          <AlertFilled />
          <LoadingOutlined />
        </div>
        <a-table v-bind="tableProps" />
        <a-space>
          <a-button
            type="primary"
            @click="handleMessage('success')"
          >
            message success 
          </a-button>
          <a-button @click="handleMessage('info')">
            message info
          </a-button>
        </a-space>
        <a-space>
          <a-button
            type="primary"
            @click="handleModal('success')"
          >
            modal success
          </a-button>
          <a-button @click="handleModal('info')">
            modal info
          </a-button>
        </a-space>
        <a-space>
          <a-button
            type="primary"
            @click="handleNotification('success')"
          >
            notification success
          </a-button>
          <a-button @click="handleNotification('info')">
            notification info
          </a-button>
        </a-space>
      </div>
  </template>
  
  <script setup lang="ts">
  import { theme as antdTheme } from "ant-design-vue"
  import { reactive } from "#imports";
  const tableProps = reactive({
    dataSource:[
      {
        key: '1',
        name: 'Mike',
        age: 32,
        address: '10 Downing Street',
      },
      {
        key: '2',
        name: 'John',
        age: 42,
        address: '10 Downing Street',
      },
    ],
    columns:[
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
      },
    ]
  })
  
  type StatusType = 'success' | 'info'
  
  const handleMessage = (type:StatusType) => {
    if(type === 'success')
      message.success('This is a prompt message for success, and it will disappear in 10 seconds', 10);
    else if(type === 'info'){
      message.info('This is a prompt message for info, and it will disappear in 10 seconds', 10);
    }
  }
  
  const handleModal = (type:StatusType) =>{
    if(type === 'success')
      Modal.success({
        title: 'This is a success message',
        content: 'some messages...some messages...',
      });
    else if(type === 'info'){
      Modal.info({
        title: 'This is a info message',
        content: 'some messages...some messages...',
      });
    }
  }
  
  const handleNotification = (type:StatusType) =>{
    if(type === 'success')
      notification.success({
        message: 'Notification Title',
        description:
          'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      });
    else if(type === 'info'){
      notification.info({
        message: 'Notification Title',
        description:
          'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      });
    }
  }
  </script>
  
  <style>
  </style>