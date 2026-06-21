export interface ApiResponse<T> {
  success: boolean;
  mensaje?: string;
  datos: T;
}
