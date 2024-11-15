import React from "react";
import AppStyles from "@/assets/css";
import { Center } from "@/components/ui/center";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { formValidate } from "@/utils/validator";
import { configCreateWorkspace } from "@/constants/Validator";
import { createNewWorspace, fitComponentSize } from "@/utils";
import { router } from "expo-router";
import { pushWorkspace, setCurrentWorkspace, setDraftWorkspace } from "@/utils";
import AntDesign from "@expo/vector-icons/AntDesign";
import { HStack } from "@/components/ui/hstack";
import { makeMutable } from "react-native-reanimated";
import { scale, verticalScale } from "react-native-size-matters";
import { FrameComponent, Workspace } from "@/type/store";
import uuid from "react-native-uuid";
import { INIT_MATRIX } from "@/constants/Workspace";

const CreateWorkspace = () => {
  const { width: widthDimensions, height: heightDimensions } =
    useWindowDimensions();
  const [width, setWidth] = React.useState<string>("");
  const [height, setHeight] = React.useState<string>("");
  const [error, setError] = React.useState<{ width?: string; height?: string }>(
    {}
  );
  const canCreateWorkspace = React.useMemo(
    () => Boolean(width) && Boolean(height),
    [width, height]
  );

  const validateWorkspace = React.useMemo(
    () => () => {
      const widthError = formValidate(configCreateWorkspace.width, width);
      const heightError = formValidate(configCreateWorkspace.height, height);
      const errorAfterValidate = {
        width: widthError.message,
        height: heightError.message,
      };
      if (widthError.status) {
        delete errorAfterValidate.width;
      }
      if (heightError.status) {
        delete errorAfterValidate.height;
      }
      setError(errorAfterValidate);
      return Object.keys(errorAfterValidate).length === 0;
    },
    [width, height]
  );

  const submitWorkspace = React.useMemo(
    () => () => {
      if (validateWorkspace()) {
        const newWorkspace = createNewWorspace({
          size: {
            width: Number(width),
            height: Number(height),
          },
        });
        const fitRootView = fitComponentSize({
          imageHeight: newWorkspace.size.height,
          imageWidth: newWorkspace.size.width,
          widthDimensions: widthDimensions - scale(15),
          heightDimensions: heightDimensions - verticalScale(50),
        });
        const rootFrameId = uuid.v4() as string;
        const initFrame: Array<FrameComponent> = [
          {
            id: rootFrameId,
            name: "Root",
            components: [],
            size: {
              width: Number(width),
              height: Number(height),
            },
            matrix: INIT_MATRIX.map((v) => makeMutable(v)),
          },
        ];

        const initWorkspaceView: Workspace = {
          ...newWorkspace,
          viewResize: {
            width: makeMutable(fitRootView.width),
            height: makeMutable(fitRootView.height),
            scale: makeMutable(fitRootView.scale),
          },
          transform: {
            translateX: makeMutable(0),
            translateY: makeMutable(0),
          },
          frames: initFrame,
          frameId: rootFrameId,
        };
        setCurrentWorkspace(initWorkspaceView);
        setDraftWorkspace(newWorkspace);
        pushWorkspace(initWorkspaceView);
        router.navigate("/workspace");
      }
    },
    [width, height]
  );

  return (
    <View style={AppStyles.container}>
      <Center className="bg-primary-100 bg-opacity-50 flex-1">
        <VStack space="sm" className="bg-white p-5 rounded-md">
          <HStack>
            <Heading className="mr-2">CREATE WORKSPACE</Heading>
            <Pressable onPress={router.back}>
              <AntDesign name="close" size={24} color="black" />
            </Pressable>
          </HStack>
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
            {Boolean(error.width) && (
              <FormControlError>
                <FormControlErrorText>{error.width}</FormControlErrorText>
              </FormControlError>
            )}
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
            {Boolean(error.height) && (
              <FormControlError>
                <FormControlErrorText>{error.height}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
          <Button
            onPress={submitWorkspace}
            disabled={!canCreateWorkspace}
            size="md"
            variant="solid"
            action="secondary"
          >
            <ButtonText>Create</ButtonText>
          </Button>
        </VStack>
      </Center>
    </View>
  );
};

export default CreateWorkspace;
