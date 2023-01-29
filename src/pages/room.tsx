import {
  Paper,
  Title,
  TextInput,
  Button,
  Container,
  Group,
} from '@mantine/core';

export default function Room() {
  return (
    <Container maw={450} mt={120}>
      <Title align='center'>Join the room or create a new one</Title>

      <Paper withBorder shadow='md' p={30} radius='md' mt='xl'>
        <TextInput label='Key Room' placeholder='12345678' />
        <Group position='apart' mt='lg'>
          <Button variant='light'>Create new room</Button>
          <Button variant='gradient'>Enter the room</Button>
        </Group>
      </Paper>
    </Container>
  );
}
