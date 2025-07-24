import {Container, Heading, Text, VStack, Divider} from '@chakra-ui/react';

const Dashboard = () => {
    return (
        <Container maxW="4xl" mx="auto" p={8}>
            <VStack spacing={6} align="start">
                <Heading size="lg">Admin Dashboard</Heading>
                <Divider />

                <Text fontSize="md">
                    Welcome to the administration interface. Here you can : 
                </Text>

                <VStack align="start" spacing={2}>
                    <Text>- Manage users (view, delete, modify roles)</Text>
                    <Text>- Access platform statistics</Text>
                    <Text>- Supervise content (games, manga, music, etc.)</Text>
                </VStack>
            </VStack>
        </Container>
    );
};

export default Dashboard;