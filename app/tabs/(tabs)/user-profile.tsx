import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import React from "react";

const UserProfile = () => {
  const router = useRouter();
  return (
    <Box>
      <Card className="p-6 rounded-lg m-3">
        <Box className="flex-row">
          <Avatar className="mr-4">
            <AvatarFallbackText>JD</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: "https://gluestack.github.io/public-blog-video-assets/camera.png",
              }}
            />
          </Avatar>
          <VStack>
            <Heading size="md" className="mb-1">
              Michael Jordan
            </Heading>
            <Text size="sm">On a journey to capture moments.</Text>
          </VStack>
        </Box>
      </Card>
      <Card className="p-6 rounded-lg m-3">
        <VStack>
          <HStack space="md" className="mb-2">
            <FontAwesome name="user" size={16} />
            <Text>Michael Jordan</Text>
          </HStack>
        </VStack>
        <Divider />
        <VStack className="mt-2">
          <HStack space="md" className="mb-2">
            <FontAwesome name="globe" size={16} />
            <Text>https://www.michaeljordan.com</Text>
          </HStack>
        </VStack>
        <Divider />
        <VStack className="mt-2">
          <HStack space="md" className="mb-2">
            <FontAwesome name="envelope" size={16} />
            <Text>michael@jordan.com</Text>
          </HStack>
        </VStack>
      </Card>
      <Box className="mx-2">
        <Button
          className="py-2 px-4"
          onPress={() => {
            router.push("/login");
          }}
        >
          <ButtonText size="sm">Log out</ButtonText>
        </Button>
      </Box>
    </Box>
  );
};

export default UserProfile;