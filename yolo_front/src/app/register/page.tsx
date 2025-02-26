'use client'
import { Button, Form, FormProps, Input } from 'antd';
type FieldType = {
  username?: string;
  password?: string;
  email?: string;
};

export default function Page() {
  const [form] = Form.useForm()

  const formInit: FormProps = {
    initialValues: {
      username: '',
      password: ''
    },
    form,
    onFinish: async (value) => {
      console.log(value)
      const data = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(value)
      })

      const res = await data.json()
      console.log(res)
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <Form {...formInit}>
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
