import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Divider } from "@/components/ui/divider";
import { Button, ButtonText } from "@/components/ui/button";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const UserProfile = () => {
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
        <Button className="py-2 px-4">
          <ButtonText size="sm">Log out</ButtonText>
        </Button>
      </Box>
    </Box>
  );
};

export default UserProfile;