import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getRentalById, updateRentalById } from 'apiSdk/rentals';
import { Error } from 'components/error';
import { rentalValidationSchema } from 'validationSchema/rentals';
import { RentalInterface } from 'interfaces/rental';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ToolInterface } from 'interfaces/tool';
import { UserInterface } from 'interfaces/user';
import { OutletInterface } from 'interfaces/outlet';
import { getTools } from 'apiSdk/tools';
import { getUsers } from 'apiSdk/users';
import { getOutlets } from 'apiSdk/outlets';

function RentalEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<RentalInterface>(
    () => (id ? `/rentals/${id}` : null),
    () => getRentalById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: RentalInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateRentalById(id, values);
      mutate(updated);
      resetForm();
      router.push('/rentals');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<RentalInterface>({
    initialValues: data,
    validationSchema: rentalValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Rental
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="rental_date" mb="4">
              <FormLabel>Rental Date</FormLabel>
              <Box display="flex" maxWidth="100px" alignItems="center">
                <DatePicker
                  dateFormat={'dd/MM/yyyy'}
                  selected={formik.values?.rental_date ? new Date(formik.values?.rental_date) : null}
                  onChange={(value: Date) => formik.setFieldValue('rental_date', value)}
                />
                <Box zIndex={2}>
                  <FiEdit3 />
                </Box>
              </Box>
            </FormControl>
            <FormControl id="return_date" mb="4">
              <FormLabel>Return Date</FormLabel>
              <Box display="flex" maxWidth="100px" alignItems="center">
                <DatePicker
                  dateFormat={'dd/MM/yyyy'}
                  selected={formik.values?.return_date ? new Date(formik.values?.return_date) : null}
                  onChange={(value: Date) => formik.setFieldValue('return_date', value)}
                />
                <Box zIndex={2}>
                  <FiEdit3 />
                </Box>
              </Box>
            </FormControl>
            <AsyncSelect<ToolInterface>
              formik={formik}
              name={'tool_id'}
              label={'Select Tool'}
              placeholder={'Select Tool'}
              fetcher={getTools}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <AsyncSelect<OutletInterface>
              formik={formik}
              name={'outlet_id'}
              label={'Select Outlet'}
              placeholder={'Select Outlet'}
              fetcher={getOutlets}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'rental',
    operation: AccessOperationEnum.UPDATE,
  }),
)(RentalEditPage);