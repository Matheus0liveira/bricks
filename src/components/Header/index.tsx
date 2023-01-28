import { useState } from 'react';
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
import { Logout, Settings, Trash, ChevronDown } from 'tabler-icons-react';
import { MantineLogo } from '@mantine/ds';
import { useStyles } from './useStyles';

interface HeaderTabsProps {
  user: { name: string; image: string };
}

export function Header({ user }: HeaderTabsProps) {
  const { classes, cx } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);

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
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, {
                  [classes.userActive]: userMenuOpened,
                })}
              >
                <Group spacing={7}>
                  <Avatar
                    src={user.image}
                    alt={user.name}
                    radius='xl'
                    size={20}
                  />
                  <Text weight={500} size='sm' sx={{ lineHeight: 1 }} mr={3}>
                    {user.name}
                  </Text>
                  <ChevronDown size={12} stroke={'1.5'} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Settings</Menu.Label>
              <Menu.Item icon={<Settings size={14} stroke={'1.5'} />}>
                Account settings
              </Menu.Item>

              <Menu.Item icon={<Logout size={14} stroke={'1.5'} />}>
                Logout
              </Menu.Item>

              <Menu.Divider />

              <Menu.Label>Danger zone</Menu.Label>
              <Menu.Item color='red' icon={<Trash size={14} stroke={'1.5'} />}>
                Delete account
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Container>
    </div>
  );
}
