'use client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useUsersStore } from '@/store/store';

export function SearchResults() {
  const users = useUsersStore((state) => state.users);

  if (users.length === 0) {
    return <></>;
  }

  return (
    <Table>
      <TableCaption>Searching results:</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Firstname</TableHead>
          <TableHead>Lastname</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Username</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.firstName}</TableCell>
            <TableCell>{user.lastName}</TableCell>
            <TableCell>{user.age}</TableCell>
            <TableCell>{user.username}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
