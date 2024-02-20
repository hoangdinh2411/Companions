import { Express } from 'express';

const Routes = (app:  Express) => {
  app.get("/health", (req, res) => {
    return res.status(200).json({ ok: true });
  });
};
export default Routes;
