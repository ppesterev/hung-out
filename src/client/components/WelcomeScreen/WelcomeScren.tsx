interface WelcomeScreenProps {
  message: string;
}

export default function WelcomeScreen({ message }: WelcomeScreenProps) {
  return <h1>{message}</h1>;
}
