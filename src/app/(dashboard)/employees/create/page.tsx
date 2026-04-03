'use client';

import EmployeeForm from '@/components/forms/EmployeeForm';
import { useRouter } from 'next/navigation';

export default function CreateEmployeePage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/employees');
  };

  return (
    <div className='p-8'>
      <EmployeeForm onSuccess={handleSuccess} />
    </div>
  );
}
