import { Operations } from '../components/operations';
import '../components/components.css';

export function EmployeeOperations() {
  const operations = [
    {
      title: 'Add Employee',
      description: 'Add a new employee to the museum collection',
      icon: '➕',
      path: '/login/employee/add-employee',
    },
    {
      title: 'Remove Employee',
      description: 'Remove an existing employee from the collection',
      icon: '❌',
      path: '/login/employee/remove-employee'
    },
    {
      title: 'Modify Employee',
      description: 'Update information for an existing employee',
      icon: '✏️',
      path: '/login/employee/modify-employee'
    }
  ];

  return (
    <Operations title="Employee" operations={operations}/>
  )
}