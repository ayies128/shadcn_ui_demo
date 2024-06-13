"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
};

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
const formSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
})

export default function Home() {
  const { setTheme } = useTheme()
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>({id: 0, name: "", email: "", created_at: "", updated_at: ""});
  useEffect(() => {
    setListUsers();
  }, []);

  useEffect(() => {
    form.reset({
      name: user.name,
      email: user.email,
    })
  }, [user])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) =>{
    console.log("===ユーザー一個別報更新===")
    // データを更新して一覧も更新する
    fetch("http://localhost:3000/api/v1/users/"+user.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({user: values}),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      setListUsers();
    })
  }

  const setListUsers = () =>{
    console.log("===ユーザー一覧情報取得===")
    fetch("http://localhost:3000/api/v1/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users));
  }

  const setEditUser = (id: number) =>{
    console.log("===ユーザー個別情報取得===")
    fetch("http://localhost:3000/api/v1/users/"+id)
      .then((res) => res.json())
      .then((data) => setUser(data.user));
  }


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardHeader>
              <CardTitle>ユーザー情報変更</CardTitle>
              <CardDescription>ユーザーの情報を変更できます</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>名前</FormLabel>
                    <FormControl>
                      <Input placeholder="名前" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス</FormLabel>
                    <FormControl>
                      <Input placeholder="メールアドレス" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit">更新</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">名前</TableHead>
            <TableHead>メールアドレス</TableHead>
            <TableHead>作成日時</TableHead>
            <TableHead>更新日時</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            return (
              <TableRow onClick={() => setEditUser(user.id)}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.created_at}</TableCell>
                <TableCell>{user.updated_at}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

    </>
  );
}
