export class KalmanFilter {
  R: number;
  Q: number;
  A: number;
  B: number;
  C: number;
  covariance: number;
  value: number;

  constructor({ R = 1, Q = 1, A = 1, B = 0, C = 1 } = {}) {
    this.R = R; // Nhiễu quá trình
    this.Q = Q; // Nhiễu đo lường
    this.A = A; // Hệ số chuyển trạng thái
    this.B = B; // Hệ số điều khiển
    this.C = C; // Hệ số đo lường
    this.covariance = NaN; // Covariance chưa xác định
    this.value = NaN; // Giá trị trạng thái ban đầu không xác định
  }

  clear() {
    this.covariance = NaN; // Covariance chưa xác định
    this.value = NaN; // Giá trị trạng thái ban đầu không xác định
  }

  predict(control: number = 0): void {
    if (isNaN(this.value)) {
      return;
    }
    this.value = this.A * this.value + this.B * control;
    this.covariance = this.A * this.covariance * this.A + this.R;
  }

  correct(measurement: number): number {
    if (isNaN(this.value)) {
      this.value = (1 / this.C) * measurement;
      this.covariance = (1 / this.C) * this.Q * (1 / this.C);
    } else {
      const K =
        this.covariance *
        this.C *
        (1 / (this.C * this.covariance * this.C + this.Q));
      this.value = this.value + K * (measurement - this.C * this.value);
      this.covariance = (1 - K * this.C) * this.covariance;
    }
    return this.value;
  }

  filter(measurement: number, control: number = 0): number {
    this.predict(control);
    return this.correct(measurement);
  }
}
