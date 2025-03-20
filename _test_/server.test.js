import {app,server} from '../src/server/server'
import request from "supertest";
afterAll(async () => {
  server.close(); 
});
describe('GET /', () => {
    it('should return the index.html file', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toContain('<!doctype html>'); 
    });
  });