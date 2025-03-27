import { useState } from "react";
import { Box, Typography, Button, Tabs, Tab, Card, CardContent, Grid, AppBar, Toolbar, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import BarChart from "./BarChart";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);

  return (
    <div>


    <Sidebar/>
    <Box sx={{ flexGrow: 1 }}>
      {/* Top Bar */}
      <AppBar position="static" color="default" sx={{ mb: 2, p: 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <InputBase placeholder="Search…" sx={{ ml: 2, flex: 1, border: "1px solid gray", borderRadius: 1, p: 1 }} />
          <IconButton>
            <SearchIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Tabs */}
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
        <Tab label="Overview" />
        <Tab label="Analytics" disabled />
        <Tab label="Reports" disabled />
        <Tab label="Notifications" disabled />
      </Tabs>

      {/* Metrics Cards */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {[
          { title: "Total Revenue", value: "$45,231.89", change: "+20.1%" },
          { title: "Subscriptions", value: "+2,350", change: "+180.1%" },
          { title: "Sales", value: "+12,234", change: "+19%" },
          { title: "Active Now", value: "+573", change: "+201" },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" color="textSecondary">
                  {item.title}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {item.value}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.change} from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Overview & Recent Sales */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6">Overview</Typography>
              <BarChart /> {/* Placeholder for a bar chart component */}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Recent Sales</Typography>
              <Typography variant="body2">You made 265 sales this month.</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Download Button */}
      <Box sx={{ mt: 2, textAlign: "right" }}>
        <Button variant="contained" startIcon={<DownloadIcon />}>Download</Button>
      </Box>
    </Box>
    </div>
  );
};

export default Dashboard;