import React from "react";
import AppStyles from "@/assets/css";
import { Center } from "@/components/ui/center";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Text, View } from "react-native";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";

const CreateWorkspace = () => {
  const [width, setWidth] = React.useState<string>("");
  const [height, setHeight] = React.useState<string>("");

  return (
    <View style={AppStyles.container}>
      <Center className="bg-primary-100 bg-opacity-50 flex-1">
        <VStack space="sm" className="bg-white p-5 rounded-md">
          <Heading>CREATE WORKSPACE</Heading>
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Width</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                value={width}
                onChangeText={setWidth}
                type="text"
                keyboardType="numeric"
              />
              <Text className="mr-2">px</Text>
            </Input>
          </FormControl>
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Height</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                value={height}
                onChangeText={setHeight}
                type="text"
                keyboardType="numeric"
              />
              <Text className="mr-2">px</Text>
            </Input>
          </FormControl>
          <Button size="md" variant="solid" action="secondary">
            <ButtonText>Create</ButtonText>
          </Button>
        </VStack>
      </Center>
    </View>
  );
};

export default CreateWorkspace;
