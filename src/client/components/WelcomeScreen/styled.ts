import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  place-content: center;

  min-height: 100vh;
`;

export const WelcomeForm = styled.form`
  display: grid;
  place-content: center;
  gap: 10px;

  padding: 10px;

  border: 1px solid grey;
  border-radius: 10px;
`;

export const NameInput = styled.input`
  padding: 5px;
  border-radius: 5px;
`;
