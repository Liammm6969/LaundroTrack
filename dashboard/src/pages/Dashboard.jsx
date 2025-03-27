import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
  Container,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import BarChart from "./BarChart";
import Sidebar from "./Sidebar";
import "./Dashboad.css";

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box className="dashboard-container">
      <Sidebar />

      <Box className="dashboard-content">
        {/* Top Bar */}
        <AppBar position="static" color="default" className="top-bar">
          <Toolbar>
            <Typography variant="h6" className="dashboard-title">
              Dashboard
            </Typography>
            <Box className="search-box">
              <InputBase placeholder="Search…" className="search-input" />
              <IconButton>
                <SearchIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Tabs */}
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          className="dashboard-tabs"
        >
          <Tab label="Overview" />
          <Tab label="Analytics" disabled />
          <Tab label="Reports" disabled />
          <Tab label="Notifications" disabled />
        </Tabs>

        <Container maxWidth="xl">
          {/* Metrics Cards */}
          <Grid container spacing={2} className="metrics-grid">
            {[
              { title: "Total Revenue", value: "0", change: "0" },
              { title: "Subscriptions", value: "0", change: "0" },
              { title: "Sales", value: "0", change: "0" },
              { title: "Active Now", value: "0", change: "0" },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card className="metric-card">
                  <CardContent>
                    <Typography variant="subtitle2" className="metric-title">
                      {item.title}
                    </Typography>
                    <Typography variant="h5" className="metric-value">
                      {item.value}
                    </Typography>
                    <Typography variant="body2" className="metric-change">
                      {item.change} from last month
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Overview & Recent Sales */}
          <Grid container spacing={2} className="overview-grid">
            <Grid item xs={12} md={8}>
              <Card className="overview-card">
                <CardContent>
                  <Typography variant="h6">Overview</Typography>
                  <BarChart /> {/* Placeholder for a bar chart component */}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className="overview-card">
                <CardContent>
                  <Typography variant="h6">Recent Sales</Typography>
                  <Typography variant="body2">You made 0 sales this month.</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Download Button */}
          <Box className="download-btn-container">
            <Button variant="contained" startIcon={<DownloadIcon />}>
              Download
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
