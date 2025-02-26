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
    initialValues: {},
    form,
    onFinish: async (value) => {
      const data = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(value)
      })

      const res = await data.json()
      if (res.token) {
        // setCookit(res.token)
        localStorage.setItem('token', res.token)
        window.location.href = '/dashboard'
      } else {
        console.log(res)
      }

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

