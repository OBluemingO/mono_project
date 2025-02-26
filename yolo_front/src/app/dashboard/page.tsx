'use client'
import { Table } from "antd";
import { useEffect, useState } from "react";

interface User {
  id: number;
  key: number;
  username: string;
  password: string;
  email: string;
}

export default function Page() {
  const [dataSource, setDataSource] = useState<User[]>([])

  useEffect(() => {
    (async () => {
      const data = await fetch("http://localhost:3000/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const dataSource: User[] = await data.json()
      const format = dataSource.map((el) => {
        return {
          ...el,
          key: el.id,
        }
      })
      setDataSource(format)
    })()
  }, [])
  // console.log(data)
  // const dataSource = [
  //   {
  //     key: '1',
  //     username: 'Mike',
  //   },
  //   {
  //     key: '2',
  //     name: 'John',
  //   },
  // ];

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'age',
    },
    {
      title: 'password',
      dataIndex: 'password',
      key: 'password',
    },
  ];

  return (
    <Table dataSource={dataSource} columns={columns} />
  )

}
