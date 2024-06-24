export function handelResponse({
  statusCode,
  message,
  data,
}: {
  statusCode: number;
  message: string;
  data?: any;
}) {
  return {
    statusCode,
    message,
    data,
  };
}
