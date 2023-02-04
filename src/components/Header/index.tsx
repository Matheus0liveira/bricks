import { useCallback, useState } from 'react';
import {
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Burger,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Logout, ChevronDown, ArrowBack } from 'tabler-icons-react';
import { MantineLogo } from '@mantine/ds';
import { useStyles } from './useStyles';
import { signOut, useSession } from 'next-auth/react';
import { deleteClientRoomCookie } from '@/utils';
import { useRouter } from 'next/router';

export function Header() {
  const { classes, cx } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { data } = useSession();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    deleteClientRoomCookie();
  };

  const handleBackRoom = useCallback(() => {
    deleteClientRoomCookie();
    router.push('/room');
  }, [router]);

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection}>
        <Group position='apart'>
          <MantineLogo size={28} />

          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size='sm'
          />

          <Menu
            width={260}
            position='bottom-end'
            transition='pop-top-right'
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
          >
            {data?.user ? (
              <Menu.Target>
                <UnstyledButton
                  className={cx(classes.user, {
                    [classes.userActive]: userMenuOpened,
                  })}
                >
                  <Group spacing={7}>
                    <Avatar
                      src={data.user.image || ''}
                      alt={data.user.name || ''}
                      radius='xl'
                      size={20}
                    />
                    <Text weight={500} size='sm' sx={{ lineHeight: 1 }} mr={3}>
                      {data.user.name}
                    </Text>
                    <ChevronDown size={12} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
            ) : null}
            <Menu.Dropdown>
              <Menu.Item
                icon={<ArrowBack size={14} />}
                onClick={handleBackRoom}
              >
                Enter other room
              </Menu.Item>
              <Menu.Label>Danger zone</Menu.Label>
              <Menu.Item
                icon={<Logout size={14} />}
                onClick={handleSignOut}
                color='red'
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Container>
    </div>
  );
}
