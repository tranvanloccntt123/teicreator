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
import { Text, View } from "react-native";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { formValidate } from "@/utils/validator";
import { configCreateWorkspace } from "@/constants/Validator";
import { QueryKeys } from "@/constants/QueryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { DraftWorkspace, Workspace } from "@/type/store";
import { createNewWorspace } from "@/utils";
import { router } from "expo-router";

const CreateWorkspace = () => {
  const queryClient = useQueryClient();
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
        queryClient.setQueryData(
          [QueryKeys.CURRENT_WORKSPACE],
          (): Workspace => {
            return newWorkspace;
          }
        );
        queryClient.setQueryData(
          [QueryKeys.DRAFT_WORKSPACE],
          (): DraftWorkspace => {
            return newWorkspace;
          }
        );
        queryClient.setQueryData(
          [QueryKeys.WORKSPACE_LIST],
          (oldData: Workspace[] | undefined): Workspace[] => [
            ...(oldData || []),
            newWorkspace,
          ]
        );
        router.navigate("/workspace");
      }
    },
    [width, height]
  );

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
