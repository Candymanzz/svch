import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  CircularProgress,
  IconButton,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import StarIcon from "@mui/icons-material/Star";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[8],
  },
}));

const StyledCardMedia = styled(CardMedia)({
  paddingTop: "100%", // 1:1 Aspect Ratio
  position: "relative",
  "&:hover": {
    "& .MuiCardMedia-overlay": {
      opacity: 1,
    },
  },
});

const MediaOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  opacity: 0,
  transition: "opacity 0.3s ease-in-out",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const Model = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    // Симулируем загрузку данных
    const dummyData = [
      {
        id: 1,
        name: "Classic Aviator",
        price: "$149.99",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Timeless aviator style with modern comfort",
        category: "Sunglasses",
      },
      {
        id: 2,
        name: "Modern Round",
        price: "$129.99",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Contemporary round frames with blue light protection",
        category: "Optical",
      },
      {
        id: 3,
        name: "Cat Eye Classic",
        price: "$159.99",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1577803645773-f96470509666?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Elegant cat-eye design for a sophisticated look",
        category: "Sunglasses",
      },
      {
        id: 4,
        name: "Sport Shield",
        price: "$179.99",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "High-performance shield design for active lifestyle",
        category: "Sport",
      },
    ];

    setTimeout(() => {
      setItems(dummyData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 6 }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 4 }}
        >
          <Link
            underline="hover"
            color="inherit"
            component={RouterLink}
            to="/"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography color="text.primary">Models</Typography>
        </Breadcrumbs>

        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Featured Models
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          Discover our carefully curated collection of eyewear, featuring the latest
          trends and timeless classics. Each piece is crafted with precision and
          style in mind.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {items.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
            <StyledCard>
              <StyledCardMedia
                image={item.image}
                title={item.name}
              >
                <MediaOverlay className="MuiCardMedia-overlay">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<VisibilityIcon />}
                    component={RouterLink}
                    to={`/model/${item.id}`}
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      color: "text.primary",
                      "&:hover": {
                        backgroundColor: "white",
                      },
                    }}
                  >
                    Quick View
                  </Button>
                </MediaOverlay>
              </StyledCardMedia>

              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ mb: 1 }}>
                  <Chip
                    label={item.category}
                    size="small"
                    sx={{ backgroundColor: "rgba(25, 118, 210, 0.1)" }}
                  />
                </Box>
                <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {item.description}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6" color="primary">
                    {item.price}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <StarIcon sx={{ color: "gold", mr: 0.5 }} />
                    <Typography variant="body2">{item.rating}</Typography>
                  </Box>
                </Box>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ShoppingBagIcon />}
                  sx={{
                    borderRadius: "25px",
                    textTransform: "none",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Model;
