export interface ApiResponse<TData> {
  data: TData;
  response: {
    success: boolean;
    message: string;
  };
}

export interface LegacyReadResponse<TData> {
  data: TData;
  response: string;
}

export interface LegacyWriteResponse {
  p_result: number;
  p_id?: number;
  p_response: string;
}

export class ApiResponseFactory {
  static success<TData>(data: TData, message: string): ApiResponse<TData> {
    return {
      data,
      response: {
        success: true,
        message,
      },
    };
  }

  static legacyRead<TData>(
    data: TData,
    message: string,
    success = true,
  ): LegacyReadResponse<TData> {
    return {
      data,
      response: JSON.stringify({
        success,
        message,
      }),
    };
  }

  static legacyWrite(
    result: number,
    message: string,
    id?: number,
  ): LegacyWriteResponse {
    return {
      p_result: result,
      p_id: id,
      p_response: JSON.stringify({
        success: result === 1,
        message,
        id,
      }),
    };
  }
}
